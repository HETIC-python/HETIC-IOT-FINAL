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

export type Message = {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
};

export type UserProfile = {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
};