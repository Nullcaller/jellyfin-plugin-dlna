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
export default function (view, params) {

    // init code here
    view.addEventListener('viewshow', function (e) {

        LibraryMenu.setTabs('profiles', 1, getTabs);
    });

    view.addEventListener('viewhide', function (e) {

    });

    view.addEventListener('viewdestroy', function (e) {

    });
};