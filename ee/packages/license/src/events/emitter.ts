import type { BehaviorWithContext } from '../definition/LicenseBehavior';
import type { LicenseModule } from '../definition/LicenseModule';
import type { LicenseManager } from '../license';
import { logger } from '../logger';

export function moduleValidated(this: LicenseManager, module: LicenseModule) {
	try {
		this.emit('module', { module, valid: true });
		this.emit(`valid:${module}`);
	} catch (error) {
		logger.error({ msg: 'Error running module added event', error });
	}
}

export function moduleRemoved(this: LicenseManager, module: LicenseModule) {
	try {
		this.emit('module', { module, valid: false });
		this.emit(`invalid:${module}`);
	} catch (error) {
		logger.error({ msg: 'Error running module removed event', error });
	}
}

export function behaviorTriggered(this: LicenseManager, options: BehaviorWithContext) {
	const { behavior, reason, modules: _, ...rest } = options;

	try {
		this.emit(`behavior:${behavior}`, {
			reason,
			...rest,
		});
	} catch (error) {
		logger.error({ msg: 'Error running behavior triggered event', error });
	}

	if (!['prevent_action'].includes(behavior)) {
		return;
	}

	if (reason !== 'limit' || !(`limit` in rest) || !rest.limit) {
		return;
	}

	try {
		this.emit(`limitReached:${rest.limit}`);
	} catch (error) {
		logger.error({ msg: 'Error running limit reached event', error });
	}
}

export function behaviorTriggeredToggled(this: LicenseManager, options: BehaviorWithContext) {
	const { behavior, reason, modules: _, ...rest } = options;

	try {
		this.emit(`behaviorToggled:${behavior}`, {
			reason,
			...rest,
		});
	} catch (error) {
		logger.error({ msg: 'Error running behavior triggered event', error });
	}
}

export function licenseValidated(this: LicenseManager) {
	try {
		this.emit('validate');
	} catch (error) {
		logger.error({ msg: 'Error running license validated event', error });
	}
}

export function licenseInvalidated(this: LicenseManager) {
	try {
		this.emit('invalidate');
	} catch (error) {
		logger.error({ msg: 'Error running license invalidated event', error });
	}
}
