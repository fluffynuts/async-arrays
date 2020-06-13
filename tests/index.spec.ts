import "../src/index"

describe(`awaitable-array-methods`, () => {
    describe(`reduce - the mother of all`, () => {
        describe(`when seed provided`, () => {
            it(`should be able to reduce a single array with one async callback`, async () => {
                // Arrange
                const array = [1, 2, 3];
                // Act
                const result = await array.reduceAsync(async (acc, cur) => {
                    return new Promise((resolve) => {
                        // promise is already backgrounded, but let's be pedantic about the async-ness
                        setTimeout(() => {
                            resolve(acc + cur);
                        }, 10);
                    });
                }, 0);
                // Assert
                expect(result)
                    .toEqual(6);
            });
        });

        describe(`when no seed provided`, () => {
            it(`should use the first item in the array as the seed`, async () => {
                // Arrange
                const array = [1, 2, 3];
                // Act
                const result = await array.reduceAsync(async (acc, cur) => acc + cur);
                // Assert
                expect(result)
                    .toEqual(6);
            });
        });

        describe(`chaining`, () => {
            it(`should chain on from synchronous reduce`, async () => {
                // Arrange
                const start = [1, 2, 3];
                // Act
                const result = await start.reduce((acc, cur) => {
                    acc.push(cur + 1);
                    return acc;
                }, [] as number[])
                    .reduceAsync(async (acc, cur) => {
                        return await new Promise(resolve => {
                            acc.push(cur + 1);
                            resolve(acc);
                        });
                    }, [] as number[])
                // Assert
                expect(result)
                    .toEqual([3, 4, 5]);
            });

            it(`should chain on from another forEachAsync`, async () => {
                const start = [1, 2, 3];
                // Act
                const result = await start.reduceAsync(async (acc, cur) => {
                    return await new Promise(resolve => {
                        acc.push(cur + 1);
                        resolve(acc);
                    });
                }, [] as number[])
                    .reduceAsync(async (acc, cur) => {
                        return await new Promise(resolve => {
                            acc.push(cur + 1);
                            resolve(acc);
                        });
                    }, [] as number[])
                // Assert
                expect(result)
                    .toEqual([3, 4, 5]);
            });
        });
    });
});
