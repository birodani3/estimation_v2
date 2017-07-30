export interface IToastService {
    warning: (text: string, delay?: number) => void;
    success: (text: string, delay?: number) => void;
    error: (text: string, delay?: number) => void;
}

export enum ToastTheme {
    Warning = 'warning',
    Success = 'success',
    Error = 'error'
}

/* @ngInject */
export class ToastService implements IToastService {
    constructor(private $mdToast: ng.material.IToastService) { }

    warning(text: string, delay?: number): void {
        this.showToast(text, ToastTheme.Warning, delay);
    }

    success(text: string, delay?: number): void {
        this.showToast(text, ToastTheme.Success, delay);
    }

    error(text: string, delay?: number): void {
        this.showToast(text, ToastTheme.Error, delay);
    }

    private showToast(text: string, theme: ToastTheme, delay: number = 3000): void {
        const toast = this.$mdToast
            .simple()
            .textContent(text)
            .position('top right')
            .hideDelay(delay)
            .theme(theme);

        this.$mdToast.show(toast);
    }
}
