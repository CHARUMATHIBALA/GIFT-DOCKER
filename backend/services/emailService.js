
import nodemailer from "nodemailer"

// Configure transporter (use environment variables in production)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "yourmail@gmail.com",
    pass: process.env.EMAIL_PASS || "app-password"
  }
})

export const sendOrderConfirmationEmail = async (email, orderData) => {
  try {
    const mailOptions = {
      from: `"Gift Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmed - #${orderData._id?.slice(-6) || 'N/A'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
            <p style="margin: 10px 0; font-size: 16px;">Thank you for your purchase</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Order Details</h2>
            <p style="color: #666; margin: 10px 0;">Order ID: <strong>#${orderData._id?.slice(-6) || 'N/A'}</strong></p>
            <p style="color: #666; margin: 10px 0;">Order Date: <strong>${new Date(orderData.createdAt).toLocaleDateString()}</strong></p>
            <p style="color: #666; margin: 10px 0;">Total: <strong style="color: #667eea;">$${orderData.total || '0.00'}</strong></p>
            <p style="color: #666; margin: 10px 0;">Status: <strong>${orderData.status || 'Processing'}</strong></p>
            
            <h3 style="color: #333; margin-top: 20px; margin-bottom: 10px;">Order Items</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              ${orderData.products?.map((item, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; ${index !== orderData.products.length - 1 ? 'border-bottom: 1px solid #dee2e6;' : ''}">
                  <div>
                    <p style="margin: 0; font-weight: bold;">${item.name || 'Product'}</p>
                    <p style="margin: 0; color: #666; font-size: 14px;">Quantity: ${item.quantity || 1}</p>
                  </div>
                  <p style="margin: 0; font-weight: bold; color: #667eea;">$${(item.price || 0) * (item.quantity || 1)}</p>
                </div>
              `).join('') || '<p>No items found</p>'}
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #28a745;">✅ Your order is confirmed and will be processed shortly</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">You'll receive another email when your order ships</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Gift Shop. All rights reserved.</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Order confirmation email sent successfully')
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    throw error
  }
}

export const sendOrderShippedEmail = async (email, orderData) => {
  try {
    const mailOptions = {
      from: `"Gift Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Order Has Shipped! - #${orderData._id?.slice(-6) || 'N/A'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🚚 Your Order Has Shipped!</h1>
            <p style="margin: 10px 0; font-size: 16px;">Your package is on its way</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">Shipping Information</h2>
            <p style="color: #666; margin: 10px 0;">Order ID: <strong>#${orderData._id?.slice(-6) || 'N/A'}</strong></p>
            <p style="color: #666; margin: 10px 0;">Shipping Date: <strong>${new Date().toLocaleDateString()}</strong></p>
            <p style="color: #666; margin: 10px 0;">Expected Delivery: <strong>${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong></p>
            <p style="color: #666; margin: 10px 0;">Tracking Number: <strong>${orderData.trackingNumber || 'Available soon'}</strong></p>
            
            <div style="margin-top: 20px; padding: 15px; background: #d4edda; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #155724;">📦 Your order is on its way to you!</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Track your package with the tracking number above</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Gift Shop. All rights reserved.</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Order shipped email sent successfully')
  } catch (error) {
    console.error('Error sending order shipped email:', error)
    throw error
  }
}

export const sendOrderDeliveredEmail = async (email, orderData) => {
  try {
    const mailOptions = {
      from: `"Gift Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Delivered! - #${orderData._id?.slice(-6) || 'N/A'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎊 Order Delivered!</h1>
            <p style="margin: 10px 0; font-size: 16px;">Your package has been delivered</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #ffc107; padding-bottom: 10px;">Delivery Confirmation</h2>
            <p style="color: #666; margin: 10px 0;">Order ID: <strong>#${orderData._id?.slice(-6) || 'N/A'}</strong></p>
            <p style="color: #666; margin: 10px 0;">Delivered on: <strong>${new Date().toLocaleDateString()}</strong></p>
            <p style="color: #666; margin: 10px 0;">Total: <strong style="color: #ffc107;">$${orderData.total || '0.00'}</strong></p>
            
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #856404;">✅ Thank you for your purchase!</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">We hope you enjoy your items. Please leave a review!</p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products/${orderData._id}" 
                 style="background: #ffc107; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Leave a Review
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Gift Shop. All rights reserved.</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Order delivered email sent successfully')
  } catch (error) {
    console.error('Error sending order delivered email:', error)
    throw error
  }
}

export const sendWelcomeEmail = async (email, userData) => {
  try {
    const mailOptions = {
      from: `"Gift Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Gift Shop! 🎁",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Gift Shop!</h1>
            <p style="margin: 10px 0; font-size: 16px;">We're excited to have you join our community!</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Get Started</h2>
            <p style="color: #666; margin: 10px 0;">Hi ${userData.name || 'there'},</p>
            <p style="color: #666; margin: 10px 0;">Thank you for creating an account with Gift Shop! We're thrilled to have you on board.</p>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 10px;">What's Next?</h3>
              <ul style="color: #666; padding-left: 20px;">
                <li style="margin: 5px 0;">Browse our amazing collection of gifts</li>
                <li style="margin: 5px 0;">Create your wishlist to save favorite items</li>
                <li style="margin: 5px 0;">Enjoy fast and secure checkout</li>
                <li style="margin: 5px 0;">Track your orders in real-time</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Start Shopping
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Gift Shop. All rights reserved.</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Welcome email sent successfully')
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw error
  }
}

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const mailOptions = {
      from: `"Gift Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🔐 Reset Your Password</h1>
            <p style="margin: 10px 0; font-size: 16px;">We received a request to reset your password</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">Password Reset</h2>
            <p style="color: #666; margin: 10px 0;">Hi there,</p>
            <p style="color: #666; margin: 10px 0;">We received a request to reset your password for your Gift Shop account.</p>
            <p style="color: #666; margin: 10px 0;">Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}" 
                 style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <div style="margin: 20px 0; padding: 15px; background: #f8d7da; border-radius: 8px;">
              <p style="margin: 0; color: #721c24;">⚠️ Security Notice</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email.</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Gift Shop. All rights reserved.</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Password reset email sent successfully')
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

export const sendPromotionalEmail = async (email, subject, content, promoCode) => {
  try {
    const mailOptions = {
      from: `"Gift Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🔥 Special Offer!</h1>
            <p style="margin: 10px 0; font-size: 16px;">Exclusive deal just for you</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px;">Limited Time Offer</h2>
            <div style="color: #666; margin: 15px 0;">${content}</div>
            
            ${promoCode ? `
              <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #856404;">🎁 Use promo code:</p>
                <p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #856404;">${promoCode}</p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
                 style="background: #ff6b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Shop Now
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 Gift Shop. All rights reserved.</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Promotional email sent successfully')
  } catch (error) {
    console.error('Error sending promotional email:', error)
    throw error
  }
}

// Legacy function for backward compatibility
export const sendOrderEmail = sendOrderConfirmationEmail
