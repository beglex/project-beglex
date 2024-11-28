export interface Column<T> {
    key: Extract<keyof T, string>;
    label: string;
    editable?: boolean;
    searchable?: boolean;
    hidden?: boolean;
    required?: boolean;
}
