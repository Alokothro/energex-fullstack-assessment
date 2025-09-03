export interface Post {
    id: number;
    title: string;
    content: string;
    user_id: number;
    created_at: Date;
    updated_at: Date;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}
//# sourceMappingURL=post.types.d.ts.map