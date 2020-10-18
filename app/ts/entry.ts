import * as actions from './controller'

addEventListener('click', (e: MouseEvent) => {
	if (e.target) {
		const actionTarget = e.target.closest('*[data-action]')
		if (actionTarget) {
			const { action } = actionTarget.dataset
			if (typeof actions[action] === 'function') {
				actions[action].call(actionTarget, e)
			}
		}
	}
})
