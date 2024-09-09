export default class ModuleSettings {

  static add(key, data = {}) {
    const defaults = {
      scope: 'world',
      config: true
    }

    game.settings.register('fvtt-party-resources', key, Object.assign(defaults, data))
  }

  static get(key) {
    return game.settings.get('fvtt-party-resources', key)
  }

  static register() {
    window.pr.api.register_setting('resource_list')

    game.settings.register(
      'fvtt-party-resources',
      'first-time-startup-notification-shown',
      { scope: "client", config: false, type: Boolean, default: false }
    )

    // Hide Party Resources button for everyone
    this.add('toggle_actors_button', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.ShowActorsButton'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.ShowActorsButtonHint'),
      default: true,
      type: Boolean,
      onChange: value => ActorDirectory.collection.render('actors')
    });

    // Hide Party Resources button from players
    this.add('hide_actors_button_for_players', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.HideActorsButtonForPlayers'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.HideActorsButtonForPlayersHint'),
      default: true,
      type: Boolean,
      onChange: value => ActorDirectory.collection.render('actors')
    });

    // Settings for Icon Orientation (Top/Below)
    this.add('icon_images_orientation', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.IconImagesOrientation'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.IconImagesOrientationHint'),
      default: 'on_top',
      type: String,
      isSelect: true,
      choices: {
        on_top: game.i18n.localize('FvttPartyResources.GMSettingsForm.IconImagesOrientationOnTop'),
        below: game.i18n.localize('FvttPartyResources.GMSettingsForm.IconImagesOrientationBelow')
      },
      onChange: value => window.pr.dashboard.redraw()
    });

    // Settings for having the Status Bar
    this.add('toggle_status_bar', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.ShowStatusBar'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.ShowStatusBarHint'),
      default: true,
      type: Boolean,
      onChange: value => window.pr.status_bar.render()
    });

    // Bar location (Top/Bottom)
    this.add('status_bar_location', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarLocation'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarLocationHint'),
      default: 'on_top',
      type: String,
      isSelect: true,
      choices: {
        on_top: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarLocationOnTop'),
        at_bottom: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarLocationAtBottom')
      },
      onChange: value => window.pr.status_bar.render()
    });

    // Bar Alignment (Left/Center/Right)
    this.add('status_bar_alignment', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarAlignment'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarAlignmentHint'),
      default: 'center',
      type: String,
      isSelect: true,
      choices: {
        left: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarAlignmentLeft'),
        center: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarAlignmentCenter'),
        right: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarAlignmentRight')
      },
      onChange: value => window.pr.status_bar.render()
    });

    // Settings for Only counting a specific directory
    this.add('directory_id', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.DirectoryID'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.DirectoryIDHint'),
      default: '',
      type: String,
      onChange: value => window.location.reload()
    });

    // Settings for notification Type (Chat Msg/Toast Notification)
    this.add('notification_type', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.NotificationType'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.NotificationTypeHint'),
      type: String,
      isSelect: true,
      choices: {
        chat: game.i18n.localize('FvttPartyResources.GMSettingsForm.NotificationTypeChat'),
        toast: game.i18n.localize('FvttPartyResources.GMSettingsForm.NotificationTypeToast')
      },
      default: 'chat',
      onChange: value => window.pr.notifications.render()
    });

    // Setting for status bar color (RGB) and opacity (A)
     this.add('status_bar_color_rgb', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarColorRGB'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarColorRGBHint'),
      scope: 'client',
      config: true,
      type: String,
      default: '#000000', // Default to black
      onChange: () => window.pr.status_bar.render(),
    });

     this.add('status_bar_color_alpha', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarColorAlpha'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarColorAlphaHint'),
      scope: 'client',
      config: true,
      type: Number,
      range: {
        min: 0,
        max: 1,
        step: 0.1,
      },
      default: 0.8, // Default opacity
      onChange: () => window.pr.status_bar.render(),
    });

    // Setting for status bar height
    this.add('status_bar_height', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarHeight'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarHeightHint'),
      scope: 'client',
      config: true,
      type: Number,
      range: {
        min: 25,
        max: 100,
        step: 5,
      },
      default: 40,
      onChange: () => window.pr.status_bar.render()
    });

    // Setting for dynamic width toggle
    this.add('status_bar_dynamic_width', {
    name: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarDynamicWidth'),
    hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarDynamicWidthHint'),
    scope: 'client',
    config: true,
    type: Boolean,
    default: true,
    onChange: () => window.pr.status_bar.render(),
  });

    // Setting for status bar width
    this.add('status_bar_width', {
      name: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarWidth'),
      hint: game.i18n.localize('FvttPartyResources.GMSettingsForm.StatusBarWidthHint'),
      scope: 'client',
      config: true,
      type: Number,
      range: {
        min: 10,
        max: 100,
        step: 5,
      },
      default: 100,
      onChange: () => window.pr.status_bar.render(),
    });

  }
}
