export interface IArticle {
    _id: string;
    title: string;
    content: string;
    author: string;
    up_votes: number;
    down_votes: number
}

export type APIResponse<T> = Array<T>
