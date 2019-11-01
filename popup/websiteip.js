(function(global){ 
	'use strict';

	function websiteip_resolve(hostname, dns_type = 'A'){
		let parameters = [
			'priority_medium',
			'disable_trr',
			'bypass_cache',
		];
		if(dns_type == 'A')
			parameters.push('disable_ipv6');
		else
			parameters.push('disable_ipv4');
		return browser.dns.resolve(hostname, parameters);
	}

	function websiteip_display(hostname, dns_type, local_content, remote_content){
		if(Array.isArray(local_content.addresses) && 
			Array.isArray(remote_content.addresses)){
			local_content.addresses.sort();
			remote_content.addresses.sort();
			
			let max_length = remote_content.addresses.length;
			if(local_content.addresses.length >= remote_content.addresses.length)
				max_length = local_content.addresses.length;
		
			let table = document.createElement('table');
			let tr = document.createElement('tr');
			let th_local = document.createElement('th');
			th_local.textContent = 'Local';
			tr.appendChild(th_local);
			let th_remote = document.createElement('th');
			th_remote.textContent = 'Remote';	
			tr.appendChild(th_remote);
			let th_status = document.createElement('th');
			th_status.textContent = 'Status';
			tr.appendChild(th_status);
			table.appendChild(tr);
				
			for(var i = 0; i < max_length; ++i){
				let addresses_local = (local_content.addresses[i])?local_content.addresses[i]:'';
				let addresses_remote = (remote_content.addresses[i])?remote_content.addresses[i]:'';

				let tr = document.createElement('tr');
				let td_local = document.createElement('td');
				td_local.textContent = addresses_local;
				let td_remote = document.createElement('td');
				td_remote.textContent = addresses_remote;	
				let td_status = document.createElement('td');
				td_status.textContent = '✘';
				td_status.className = 'warning';
				if(addresses_local === addresses_remote){
					td_status.textContent = '✔';
					td_status.className = 'ok';
				}
				tr.appendChild(td_local);
				tr.appendChild(td_remote);
				tr.appendChild(td_status);
				table.appendChild(tr);
			}
			document.getElementById('websiteip_information').appendChild(table);
			
			let p = document.createElement('p');
			let a = document.createElement('a');
			a.href = 'https://www.whatsmydns.net/#'+dns_type+'/'+hostname;
			a.title = 'https://www.whatsmydns.net/ ' + dns_type + ' ' + hostname;
			a.textContent = hostname;
			p.appendChild(a);
			document.getElementById('websiteip_information').appendChild(p);
		}
	}

	browser.tabs.query({
		currentWindow: true,
		active: true
	})
	.then((tabs) => {
		let hostname = new URL(tabs[0].url).hostname;	
		let detect_ipv6 = fetch('https://ipv6.google.com', {mode: 'no-cors',});
		detect_ipv6.then(function(){
			return 'AAAA';
		}).catch(function(){
			return 'A';
		}).then(function(dns_type){
			let local_resolution = websiteip_resolve(hostname, dns_type);
			local_resolution.then(function(local_record){
				return local_record;
			}).then(function(local_record){
				// https://developers.google.com/speed/public-dns/docs/doh/json
				let remote_resolution = fetch('https://dns.google/resolve?name=' + hostname + '&type=' + dns_type);
				remote_resolution.then(result => result.json())
				.then(function(response){
					let remote_record = {addresses: []};
					response.Answer.forEach(function(el){
						// A or AAAA record (https://developers.google.com/speed/public-dns/docs/doh/json#dns_response_in_json)
						if(el.type == 1 || el.type == 28)
							remote_record.addresses.push(el.data);
					});
					websiteip_display(hostname, dns_type, local_record, remote_record);					
				});
			}).catch(function(message){
				document.getElementById('websiteip_information').textContent = message;
			});
		});
	});
})();