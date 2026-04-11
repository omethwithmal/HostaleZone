const Notification = require("../Model/Notification.js");

const serializeNotification = (notification) => ({
  id: notification._id,
  title: notification.title,
  message: notification.message,
  type: notification.type,
  isRead: notification.isRead,
  link: notification.link || '',
  createdAt: notification.createdAt,
  updatedAt: notification.updatedAt,
});

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    recipientId: req.user._id,
  }).sort({ createdAt: -1 });

  res.json({
    notifications: notifications.map(serializeNotification),
  });
};

exports.markNotificationAsRead = async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipientId: req.user._id,
  });

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  notification.isRead = true;
  await notification.save();

  res.json({ notification: serializeNotification(notification) });
};

exports.markAllNotificationsAsRead = async (req, res) => {
  await Notification.updateMany(
    { recipientId: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({ message: 'All notifications marked as read' });
};
