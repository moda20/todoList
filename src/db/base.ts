
export interface BaseTime {
    createdAt: Date;
    updateAt: Date;
}

export function PreSaveAddingTimeStamp(next) {
    const now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
}
