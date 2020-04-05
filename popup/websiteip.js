(function(global){ 
	'use strict';

	/**
	 resolve a hostname based on network.trr.mode, it could use the local resolver or DOH
	 **/
	function websiteip_resolve(hostname, dns_type = 'A'){
		let parameters = [
			'priority_medium',
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
			// intersection of local and remote resolution
			let intersection = local_content.addresses.filter(element => remote_content.addresses.includes(element));
			// only local resolution without the intersection
			let localonly = local_content.addresses.filter(element => !intersection.includes(element));
			// only remote resolution without the intersection
			let remoteonly = remote_content.addresses.filter(element => !intersection.includes(element));

			let table = document.createElement('table');
			let tr = document.createElement('tr');
			let th_local = document.createElement('th');
			th_local.textContent = 'Local'+((local_content.isTRR)?' (TRR)':'');
			tr.appendChild(th_local);
			let th_remote = document.createElement('th');
			th_remote.textContent = 'Remote';	
			tr.appendChild(th_remote);
			let th_status = document.createElement('th');
			th_status.textContent = 'Status';
			tr.appendChild(th_status);
			table.appendChild(tr);
			
			for(var i = 0 ; i < intersection.length ; i++){
				let tr = document.createElement('tr');
				let td_local = document.createElement('td');
				td_local.textContent = intersection[i];
				let td_remote = document.createElement('td');
				td_remote.textContent = intersection[i];	
				let td_status = document.createElement('td');
				td_status.textContent = '✔';
				td_status.className = 'ok';
				tr.appendChild(td_local);
				tr.appendChild(td_remote);
				tr.appendChild(td_status);
				table.appendChild(tr);				
			}
			
			[localonly, remoteonly].forEach(function(item, index){
				for(var i = 0 ; i < item.length ; i++){
					let tr = document.createElement('tr');
					let td_local = document.createElement('td');
					td_local.textContent = (index % 2 === 0)?item[i]:'-';
					let td_remote = document.createElement('td');
					td_remote.textContent = (index % 2 !== 0)?item[i]:'-';
					let td_status = document.createElement('td');
					td_status.textContent = '✘';
					td_status.className = 'warning';
					tr.appendChild(td_local);
					tr.appendChild(td_remote);
					tr.appendChild(td_status);
					table.appendChild(tr);				
				}
			});
	
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