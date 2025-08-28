export type Workspace = {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    sensors : Array<string | number>
};

export type IWorkspace = {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
};