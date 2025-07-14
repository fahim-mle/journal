const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password -refreshTokens');
    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Self or Admin)
router.get('/:id', auth, async (req, res) => {
  try {
    // Allow users to view their own profile or admins to view any profile
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    const user = await User.findById(req.params.id).select('-password -refreshTokens');
    
    if (!user || !user.isActive) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (Self only)
router.put('/:id', [
  auth,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Users can only update their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    const { name, email } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user || !user.isActive) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use'
        });
      }
      // If email is changed, mark as unverified
      user.isEmailVerified = false;
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Deactivate user account
// @access  Private (Self only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Users can only delete their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user || !user.isActive) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Soft delete by marking as inactive
    user.isActive = false;
    user.refreshTokens = []; // Clear all refresh tokens
    await user.save();

    res.json({ 
      success: true,
      message: 'Account deactivated successfully' 
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// @route   PUT /api/users/:id/change-password
// @desc    Change user password
// @access  Private (Self only)
router.put('/:id/change-password', [
  auth,
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Users can only change their own password
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id).select('+password');

    if (!user || !user.isActive) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    user.refreshTokens = []; // Invalidate all refresh tokens
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

module.exports = router;