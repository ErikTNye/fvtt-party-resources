import ModuleSettings from './settings.mjs';

export default class ResourceNotifications {
  constructor() {
    this.notifications = [];

    if ($('#fvtt-party-resources-notifications').length === 0) {
      $('body').append(`<div id="fvtt-party-resources-notifications"></div>`);
    }
  }

  container() {
    return $('#fvtt-party-resources-notifications');
  }

  html(message) {
    return $(`<div class="resource-notification">${message}<i class="fas fa-times close"></i></div>`);
  }

  queue(message) {
    let element = this.html(message)
    element.on('click', e => { this.clear(element) })
    this.notifications.push(element)
    return element
  }

  render() {
    const notificationType = ModuleSettings.get('notification_type')
    if (notificationType === 'toast') {
      this.renderToast();
    } else {
      this.renderChat();
    }
  }

  renderChat() {
    this.notifications.forEach((notification, index) => {
      if (game.user.isGM || game.users.active.find(u => u.isGM)) {
        emitNotification(notificationType, notification_html);
      }
    });
  }

  renderToast() {
    this.notifications.forEach((notification) => {
      const message = notification.text();
      ui.notifications.info(message);
      if (game.user.isGM || game.users.active.find(u => u.isGM)) {
        emitNotification(notificationType, notification_html);
      }
    });

    // Clear notifications after displaying
    this.notifications = [];
  }

  clear(element) {
    this.fade(element)

    if(this.container().find('.resource-notification').length == 0) {
      this.fade(this.container())
    }
  }

  fade(element) {
    if(element.length == 0) return
    element.fadeOut(200, element.empty)
  }
}


let notificationTimeout;
function emitNotification(type, content) {
  clearTimeout(notificationTimeout); // Clear any previous timeout
  notificationTimeout = setTimeout(() => {
    game.socket.emit('module.fvtt-party-resources', { type, content });
  }, 100); // Debounce delay to prevent rapid consecutive emissions
}
