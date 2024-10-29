const getConfigurationPageUrl = (name) => {
    return 'configurationpage?name=' + encodeURIComponent(name);
}

window.ApiClient.getUserActivity = function (url_to_get) {
    console.log("getUserActivity Url = " + url_to_get);
    return this.ajax({
        type: "GET",
        url: url_to_get,
        dataType: "json"
    });
};

function getTabs() {
    var tabs = [
        {
            href: getConfigurationPageUrl('config'),
            name: 'Settings'
        },
        {
            href: getConfigurationPageUrl('profiles'),
            name: 'Profiles'
        }];
    return tabs;
}

function loadProfiles(page) {
    //loading.show();
    ApiClient.getJSON(ApiClient.getUrl('ProfileInfos')).then(function (result) {
        renderUserProfiles(page, result);
        renderSystemProfiles(page, result);
        loading.hide();
    });
}

function renderUserProfiles(page, profiles) {
    renderProfiles(page, page.querySelector('.customProfiles'), profiles.filter(function (p) {
        return p.Type == 'User';
    }));
}

function renderSystemProfiles(page, profiles) {
    renderProfiles(page, page.querySelector('.systemProfiles'), profiles.filter(function (p) {
        return p.Type == 'System';
    }));
}

function renderProfiles(page, element, profiles) {
    let html = '';

    if (profiles.length) {
        html += '<div class="paperList">';
    }

    for (let i = 0, length = profiles.length; i < length; i++) {
        const profile = profiles[i];
        html += '<div class="listItem listItem-border">';
        html += '<span class="listItemIcon material-icons live_tv" aria-hidden="true"></span>';
        html += '<div class="listItemBody two-line">';
        html += "<a is='emby-linkbutton' style='padding:0;margin:0;' data-ripple='false' class='clearLink' href='#/configurationpage?name=profile&id=" + profile.Id + "'>";
        html += '<div>' + escapeHtml(profile.Name) + '</div>';
        html += '</a>';
        html += '</div>';

        if (profile.Type == 'User') {
            html += '<button type="button" is="paper-icon-button-light" class="btnDeleteProfile" data-profileid="' + profile.Id + '" title="' + globalize.translate('Delete') + '"><span class="material-icons delete" aria-hidden="true"></span></button>';
        }

        html += '</div>';
    }

    if (profiles.length) {
        html += '</div>';
    }

    element.innerHTML = html;
    $('.btnDeleteProfile', element).on('click', function () {
        const id = this.getAttribute('data-profileid');
        deleteProfile(page, id);
    });
}

function deleteProfile(page, id) {
    confirm(globalize.translate('MessageConfirmProfileDeletion'), globalize.translate('HeaderConfirmProfileDeletion')).then(function () {
        loading.show();
        ApiClient.ajax({
            type: 'DELETE',
            url: ApiClient.getUrl('Profiles/' + id)
        }).then(function () {
            loading.hide();
            loadProfiles(page);
        });
    });
}

export default function (view, params) {

    // init code here
    view.addEventListener('viewshow', function (e) {
        LibraryMenu.setTabs('profiles', 1, getTabs);
    });

    view.addEventListener('viewhide', function (e) {

    });

    view.addEventListener('viewdestroy', function (e) {

    });

    window.addEventListener('pageshow', function (_) {
        Dashboard.showLoadingMsg();
        loadProfiles(view);
    });
};