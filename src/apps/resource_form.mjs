import ResourcesList from "./../resources_list.mjs";
import ActorDnd5eResources from "./../actor_dnd5e_resources.mjs";

export default class ResourceForm extends FormApplication {
  activateListeners(html) {
    super.activateListeners(html)

    // Handle the selected state of the type dropdown, and make sure the
    // corresponding name input is shown.
    if(this.id == 'edit-resource-form') {
      const systemTypeElement = document.getElementById('system_type');
      if (systemTypeElement) {
        systemTypeElement.value = this.object.system_type;
      }
      if(this.object.system_type.includes('_item')) {
        $('#system_name').parents('div.form-group').removeClass('hidden')
      } else {
        $('#system_name').parents('div.form-group').addClass('hidden')
      }
    }

    html.on('change', '#notify_chat', event => {
      $('#notify_chat_increment_message')
        .prop('disabled', !$(event.target).prop('checked'))

      $('#notify_chat_decrement_message')
        .prop('disabled', !$(event.target).prop('checked'))
    })

    html.on('click', '#configure-permissions', event => {
      event.preventDefault()

      let permissions = game.settings.get('core', 'permissions')
      permissions.SETTINGS_MODIFY.push(1)
      game.settings.set('core', 'permissions', permissions)

      if(this.id == 'edit-resource-form') {
        this.submit()
        setTimeout(() => {
          $(`a.edit[data-setting="${this.object.identifier}"]`).trigger('click')
        }, 250)
      } else {
        setTimeout(() => { this.render(true) }, 250)
      }
    })

    html.find('#system_type').on('change', (event) => {
      const systemType = event.target.value;
  
      if (systemType === 'custom_resource') {
        html.find('#view_type').closest('.form-group').hide();
        html.find('#identifier').closest('.form-group').hide();
      } else {
        html.find('#view_type').closest('.form-group').show();
        html.find('#identifier').closest('.form-group').show();
      }
    })

    html.on('keyup', '#name, #identifier', event => {
      if(this.id == 'edit-resource-form') return

      let value = $(event.currentTarget).val()
      $('#identifier').val(this.sanitize_identifier(value))
    })

    html.on('click', '.delete', e => {
      e.stopPropagation()
      e.preventDefault();
      const setting = this.object.identifier;
      if (setting) {
        ResourcesList.remove(setting);
        this.close();
      }
    })

    // Selecting a 5e specific resource will prefil the identifier input
    // with a specific value.
    html.on('change', '#system_type', event => {
      let identifier_input = $('#identifier')
      let selection = event.currentTarget.value

      if(this.id == 'edit-resource-form') {
        if(this.object.system_type) {
          document.getElementById('system_type').value = this.object.system_type
          return
        }
      }

      if(selection.includes('_item')) {
        $('#system_name').parents('div.form-group').removeClass('hidden')
      } else {
        $('#system_name').parents('div.form-group').addClass('hidden')
      }

      // TODO: Make class call dynamic.
      if(ActorDnd5eResources.icons[selection]) {
        $('#use_icon').prop('checked', true)
        $('[name="resource[icon]"]').val(ActorDnd5eResources.icons[selection])
      }
    })

    html.find('#view_type').on('change', (event) => {
      const viewType = event.target.value;
  
      if (viewType === 'statistics') {
        html.find('input[name="resource[view_detail]"]').closest('.form-group').show();
      } else {
        html.find('input[name="resource[view_detail]"]').closest('.form-group').hide();
      }
    });
  
    const initialViewType = html.find('#view_type').val();
    if (initialViewType === 'statistics') {
      html.find('input[name="resource[view_detail]"]').closest('.form-group').show();
    } else {
      html.find('input[name="resource[view_detail]"]').closest('.form-group').hide();
    }
  }

  /**
   * Default Application options
   *
   * @returns {Object}
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "fvtt-party-resources-form",
      classes: ["fvtt-party-resources"],
      template: "modules/fvtt-party-resources/src/views/resource_form.html",
      width: 600,
      minimizable: false,
      closeOnSubmit: true
    })
  }

  getData(object) {
    let defaults = {
      id_disabled: false,
      is_gm: game.user.isGM,
      dnd5e: game.system.id == 'dnd5e',
      allowed_to_modify_settings: game.permissions.SETTINGS_MODIFY.includes(1)
    }

      const resourceData = window.pr.api.resources();
      const currentResource = resourceData.resources.find(r => r.id === this.object.identifier);
      if (currentResource) {
        defaults = foundry.utils.mergeObject(defaults, currentResource);
      } else {
        console.warn(`Resource with identifier ${this.object.identifier} not found.`);
      }

      return foundry.utils.mergeObject(defaults, this.object);
  }

  /**
   * Called "on submit". Handles saving Form's data
   *
   * @param event
   * @param formData
   * @private
   */
  async _updateObject(event, data) {
    let identifier = data['resource[identifier]'] || this.object.identifier
    if(typeof identifier == 'undefined') return

    let id = this.sanitize_identifier(identifier)
    if(id != this.object.identifier && ResourcesList.all().includes(id)) return

    ResourcesList.add(id)

    window.pr.api.register_resource(id)
    // Always update the default value
    window.pr.api.set(id, data['resource[default_value]'], { notify: true })
    // Only GM can update these fields
    if (game.user.isGM) {
    window.pr.api.set(id.concat('_name'), data['resource[name]'])
    window.pr.api.set(id.concat('_notify_chat'), data['resource[notify_chat]'])
    window.pr.api.set(id.concat('_notify_chat_increment_message'), data['resource[notify_chat_increment_message]'])
    window.pr.api.set(id.concat('_notify_chat_decrement_message'), data['resource[notify_chat_decrement_message]'])
    window.pr.api.set(id.concat('_max'), data['resource[max_value]'])
    window.pr.api.set(id.concat('_min'), data['resource[min_value]'])
    window.pr.api.set(id.concat('_player_managed'), data['resource[player_managed]'])
    window.pr.api.set(id.concat('_use_icon'), data['resource[use_icon]'])
    window.pr.api.set(id.concat('_icon'), data['resource[icon]'])
    window.pr.api.set(id.concat('_view_type'), data['resource[view_type]'])
    window.pr.api.set(id.concat('_view_detail'), data['resource[view_detail]'])
    window.pr.api.set(id.concat('_step'), data['resource[step]'])
    window.pr.api.set(id.concat('_hide_from_bar'), data['resource[hide_from_bar]'])
    window.pr.api.set(id.concat('_system_name'), data['resource[system_name]'])
    }
    if(this.id == 'add-resource-form') {
      window.pr.api.set(id.concat('_system_type'), data['resource[system_type]'])
    }
  }

  sanitize_identifier(string) {
    return string
      .toLowerCase()
      .replace(/[0-9]+/g, '')
      .replace(/[^\w ]|\s+/g, '-')
  }
}
