const mongoose = require('mongoose');
const Cache = require('../../models/cache');

describe('Cache Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Cache.deleteMany({});
    });

    it('should create a cache entry successfully', async () => {
        const validCache = {
            url: 'https://api.example.com/test',
            response: { data: 'test data' }
        };
        const cache = await Cache.create(validCache);
        
        expect(cache.url).toBe(validCache.url);
        expect(cache.response).toEqual(validCache.response);
        expect(cache._id).toBeDefined();
        expect(cache.createdAt).toBeDefined();
        expect(cache.updatedAt).toBeDefined();
    });

    it('should fail to create a cache entry without url', async () => {
        const cacheWithoutUrl = {
            response: { data: 'test data' }
        };
        let err;
        try {
            await Cache.create(cacheWithoutUrl);
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.errors.url).toBeDefined();
    });

    it('should fail to create a cache entry without response', async () => {
        const cacheWithoutResponse = {
            url: 'https://api.example.com/test'
        };
        let err;
        try {
            await Cache.create(cacheWithoutResponse);
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.errors.response).toBeDefined();
    });

    it('should find a cache entry by url', async () => {
        const cacheData = {
            url: 'https://api.example.com/find',
            response: { data: 'findable data' }
        };
        await Cache.create(cacheData);
        
        const foundCache = await Cache.findOne({ url: cacheData.url });
        expect(foundCache).toBeDefined();
        expect(foundCache.url).toBe(cacheData.url);
        expect(foundCache.response).toEqual(cacheData.response);
    });

    it('should update a cache entry', async () => {
        const cache = await Cache.create({
            url: 'https://api.example.com/update',
            response: { data: 'original data' }
        });

        const newResponse = { data: 'updated data' };
        await Cache.updateOne(
            { _id: cache._id },
            { response: newResponse }
        );

        const updatedCache = await Cache.findById(cache._id);
        expect(updatedCache.response).toEqual(newResponse);
        expect(updatedCache.updatedAt).not.toEqual(cache.updatedAt);
    });

    it('should delete a cache entry', async () => {
        const cache = await Cache.create({
            url: 'https://api.example.com/delete',
            response: { data: 'to be deleted' }
        });

        await Cache.deleteOne({ _id: cache._id });
        const deletedCache = await Cache.findById(cache._id);
        expect(deletedCache).toBeNull();
    });

    it('should store complex response objects', async () => {
        const complexResponse = {
            data: {
                items: [
                    { id: 1, name: 'Item 1' },
                    { id: 2, name: 'Item 2' }
                ],
                metadata: {
                    total: 2,
                    page: 1
                },
                nested: {
                    deeply: {
                        value: 'test'
                    }
                }
            }
        };

        const cache = await Cache.create({
            url: 'https://api.example.com/complex',
            response: complexResponse
        });

        const foundCache = await Cache.findById(cache._id);
        expect(foundCache.response).toEqual(complexResponse);
    });
}); 
