/*@ngInject*/
export default class ToastService {
    constructor($mdToast) {
        this.$mdToast = $mdToast
    }

    warning(text, delay) {
        this.showToast(text, 'warning', delay);
    }

    success(text, delay) {
        this.showToast(text, 'success', delay);
    }

    error(text, delay) {
        this.showToast(text, 'error', delay);
    }

    showToast(text, theme, delay = 3000) {
        const toast = this.$mdToast.simple({
            textContent: text,
            position: 'top right',
            hideDelay: delay,
            theme: theme
        });

        this.$mdToast.show(toast);
    }
}
