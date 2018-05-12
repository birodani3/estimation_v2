export interface Channel {
    name: string;
    hasPassword: boolean;
    values: (number | string)[];
}
