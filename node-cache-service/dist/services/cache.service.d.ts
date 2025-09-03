export declare class CacheService {
    private defaultTTL;
    constructor();
    get(key: string): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    flush(): Promise<boolean>;
}
//# sourceMappingURL=cache.service.d.ts.map