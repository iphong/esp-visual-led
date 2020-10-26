export const store: any = {
	serial_port: '',
	serial_connection_id: 0,
	show_data: ''
}

export async function set(key: string, value: any) {
	if (value instanceof Object) value = JSON.stringify(value)
	store[key] = value
	chrome.storage.local.set({ data: store }, () => {
		// console.log(`SET ${key} = ${value}`)
	})
}

export async function loadData() {
	return new Promise(resolve => {
		chrome.storage.local.get(['data'], async ({ data }) => {
			Object.assign(store, data)
			try {
				if (store.show_data) {
					store.show_data = JSON.parse(store.show_data)
				}
			} catch(e) {}
			resolve(store)
		})
	})
}
