import ModuleSettings from './settings.mjs';
import ResourceForm from './apps/resource_form.mjs'

export default class ResourcesStatusBar {
  static getData() {
    return {
      ...window.pr.api.resources(),
      ...{
        is_gm: game.user.isGM,
        status_bar: ModuleSettings.get('toggle_status_bar')
      }
    }
  }

  static async render() {
    const data = this.getData()
    const template = 'modules/fvtt-party-resources/src/views/status_bar.html'
    const status_bar = await renderTemplate(template, data)

    $('#fvtt-party-resources-status-bar').remove();
    $('#status-bar-toggle').remove();

    if(ModuleSettings.get('status_bar_location') == 'on_top') {
      $('header#ui-top').prepend(status_bar)
    }

    if(ModuleSettings.get('status_bar_location') == 'at_bottom') {
      $('footer#ui-bottom').append(status_bar)
    }

    const containerElement = $('#status-bar-container');
    const statusBarElement = $('#fvtt-party-resources-status-bar');
    const barToggleElement = $('#status-bar-toggle');
    const rgbaColor = convertToRGBA(ModuleSettings.get('status_bar_color_rgb'), ModuleSettings.get('status_bar_color_alpha'));
    const caretIcon = $('#status-bar-toggle i');
    const statusBarLocation = ModuleSettings.get('status_bar_location');
    const newHeight = ModuleSettings.get('status_bar_height');
    const widthValue = `${ModuleSettings.get('status_bar_width')}%`;


    // Set alignment classes
    statusBarElement.removeClass('status-bar-left status-bar-center status-bar-right')
      .addClass(`status-bar-${ModuleSettings.get('status_bar_alignment')}`);

    statusBarElement.css({
      'background-color': rgbaColor,
      'transition': 'height 0.3s ease',
      'height': statusBarElement.hasClass('collapsed') ? '0' : newHeight,
    }).children().css('opacity', 1);

    containerElement.css('width', widthValue);

    if (statusBarLocation === 'on_top') {
      caretIcon.removeClass('fa-caret-down').addClass('fa-caret-up');
    } else {
      caretIcon.removeClass('fa-caret-up').addClass('fa-caret-down');
    }

    $('#status-bar-contents').toggle(!statusBarElement.hasClass('collapsed'));

    // Toggle collapse logic
    $('#status-bar-toggle').click((event) => {
      event.stopPropagation();
      statusBarElement.toggleClass('collapsed');
      const isCollapsed = statusBarElement.hasClass('collapsed');
      statusBarElement.css('height', isCollapsed ? '5px' : newHeight);
      barToggleElement.css('height', isCollapsed ? '19px' : 'auto');
      $('#status-bar-toggle i').toggleClass('fa-caret-down fa-caret-up');
    });

    statusBarElement.click(() => window.pr.dashboard.render(true, { focus: true }));

    // Open resource form on click
    $('.fvtt-party-resources-resource').on('click', (event) => {
      if (!game.user.isGM || (!event.ctrlKey && !event.metaKey)) return;
      event.stopPropagation();
      const id = $(event.target).data('id');
      if (!id) return console.error('Party Resources: Clicked resource does not have an ID!');
      new ResourceForm(window.pr.dashboard.resource_data(id), {
        id: 'edit-resource-form',
        title: game.i18n.localize('FvttPartyResources.ResourceForm.EditFormTitle'),
      }).render(true, { focus: true });
    });

    // Render dashboard on click
    statusBarElement.click(() => window.pr.dashboard.render(true, { focus: true }));
  }

}

// Helper function to convert RGB to RGBA
function convertToRGBA(rgb, opacity) {
  const r = parseInt(rgb.slice(1, 3), 16);
  const g = parseInt(rgb.slice(3, 5), 16);
  const b = parseInt(rgb.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
