/*@ngInject*/
export default class ToastService {
    constructor($mdToast) {
        this.$mdToast = $mdToast
    }

    warning(text, delay) {
        this.showToast_(text, "warning", delay);
    }

    success(text, delay) {
        this.showToast_(text, "success", delay);
    }

    error(text, delay) {
        this.showToast_(text, "error", delay);
    }

    showToast_(text, theme, delay = 3000) {
        const toast = this.$mdToast.simple({
            textContent: text,
            position: "top right",
            hideDelay: delay,
            theme: theme
        });

        this.$mdToast.show(toast);
    }
}
