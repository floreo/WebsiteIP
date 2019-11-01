# WebsiteIP

[WebsiteIP](https://addons.mozilla.org/en-US/firefox/addon/websiteip/) is a simple Firefox extension to display the IP(s) of the current tab URL. It uses the [DNS  API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/dns/resolve) to resolve the hostname.

It requires two [permissions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions), no more, sadly no less:

- activeTab
- dns

# Why use it ?

Its goal is to show you the IP(s) of the URL you're currently browsing against an external DNS currently being [dns.google](https://dns.google/resolve). Simply click the icon of the extension and it will display the IP(s) of the server.

You can use this addon if you are:
* a dev: you can easily be sure you are working on your dev website version (modifify your [hosts](https://www.howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file/))
* a sysadmin: you can check you're testing the correct website while doing a migration
* anyone: you care about the server you are hitting

# Why *not* use it ?

Actually it has to go through [ipv6.google.com](https://ipv6.google.com) to find out if you are using IPv6 or not. Feel free to inspect the code and PR something more privacy friendly ;)
Moreover, to compare your local DNS entry to an online one, it uses [dns.google](https://dns.google/resolve) ... Again PR, if you have any idea on how to make it non google --'
As a matter of fact, I tried to use the Firefox [Trusted Recursive Resolver](https://wiki.mozilla.org/Trusted_Recursive_Resolver) but several points had it failed:
- Firefox user has to change the [network.trr.uri](https://wiki.mozilla.org/Trusted_Recursive_Resolver#network.trr.uri) somehow it kills the ease of use
- There is the *disable_trr* parameter to toggle/untoggle TRR mode in [browser.dns.resolve](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/dns/resolve). Sadly, it's impossible to use it correctly since the browser's [network.trr.mode](https://wiki.mozilla.org/Trusted_Recursive_Resolver#network.trr.mode) has no useable value for that. The simplicity would also be killed since a user would have to change the mode.

For anyone that cares about privacy here's a list of [DOH server](https://github.com/curl/curl/wiki/DNS-over-HTTPS). Using TRR in Firefox doesn't mean your privacy is guaranteed.

# Whatsmydns

WebsiteIP is not affiliated to [whatsmydns.net](https://www.whatsmydns.net/) but it's a decent service that I've been using on a daily basis therefore this extension uses it as link to further debug any DNS problem.

# Credits

The [icon](https://www.flaticon.com/free-icon/server-with-the-earth_31553) is made by [freepik](https://www.flaticon.com/authors/freepik) from [www.flaticon.com](www.flaticon.com)