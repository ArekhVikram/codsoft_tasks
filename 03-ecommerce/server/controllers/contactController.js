import { memoryStore } from '../data/memoryStore.js';

export async function subscribeNewsletter(req, res, next) {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    await memoryStore.addSubscriber(email.toLowerCase().trim());

    return res.status(200).json({
      success: true,
      message: 'Thank you for subscribing to NOVA SUPPLY journal. Welcome to our community.'
    });
  } catch (error) {
    next(error);
  }
}

export async function submitContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.'
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const entry = await memoryStore.addContact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim()
    });

    return res.status(200).json({
      success: true,
      message: 'Your dispatch has been received. Our studio team typically responds within 24 hours.',
      inquiryId: entry.id
    });
  } catch (error) {
    next(error);
  }
}
