# WebsiteIP

WebsiteIP is a simple Firefox extension to display the IP of the current tab URL. It uses the [DNS  API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/dns/resolve) to resolve the hostname.

# Why use it ?

Its goal is to:
* show you the IP of the URL you're browsing: be sure of the website you're browsing (wrong DNS). If you modifify your [hosts](https://www.howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file/) you can easily be sure to hit the correct website. Think about migrating websites, customer tests, etc ...
* protect your privacy: no hidden calls to an external service to resolve the hostname
* be simple: click the icon, you get the IP
