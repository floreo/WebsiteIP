browser.tabs.query({
    currentWindow: true,
    active: true
  })
  .then((tabs) => {
	let domain = new URL(tabs[0].url).hostname;	
	let resolving = browser.dns.resolve(domain, ["priority_medium", "disable_trr"]);	
	function onSuccess(record) {
		document.getElementById('website_information').innerHTML = record.addresses;
	}
	function onFailure(){
		document.getElementById('website_information').innerHTML = 'Not found !';
	}
	resolving.then(onSuccess).catch(onFailure);
  });
