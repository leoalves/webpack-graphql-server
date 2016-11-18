import { Schema } from "./schema";
import { graphql } from "graphql";
import 'jest';
import { persons } from "./schema/data-base/person-database";

function assertNoError(res) {
    if ( res.errors ) {
        console.error(res.errors);
        expect(typeof res.errors).toBe("undefined");
    }
}

describe("Schema", () => {
    it("should export valid schema", () => {
        let query = Schema.getQueryType();
        expect(typeof query).toBe("object");

        let fields: any = query.getFields();
        expect(typeof fields).toBe("object");
    });

    it("should resolve testString correctly", () => {
        let testQuery = `{
            testString
        }`;

        let expectedResponse = {
            testString: "it Works!",
        };

        return graphql(Schema, testQuery, undefined, {}).then((res) => {
            assertNoError(res);
            expect(res.data).toMatchSnapshot();
        });
    });

    it("should resolve someType correctly", () => {
        let testQuery = `{
            someType {
                testFloat,
                testInt,
                fixedString,
            }
        }`;

        return graphql(Schema, testQuery, undefined, {}).then((res) => {
            assertNoError(res);
            expect(res.data).toMatchSnapshot();
        });
    });

    it("should resolve testStringConnector correctly", () => {
        let testQuery = `{
            testStringConnector
        }`;

        return graphql(Schema, testQuery, undefined, {}).then((res) => {
            assertNoError(res);
            expect(res.data).toMatchSnapshot();
        });
    });

    it("should resolve mockedObject  correctly", () => {
        let testQuery = `{
            mockedObject {
                mockedFirstName,
                mockedInt,
            }
        }`;

        return graphql(Schema, testQuery, undefined, {}).then((res) => {
            let data = res.data;

            assertNoError(res);
            expect(data.mockedObject.mockedInt).toBeGreaterThan(-1000);
            expect(data.mockedObject.mockedInt).toBeLessThan(1000);

            expect(data.mockedObject.mockedFirstName).toMatchSnapshot();
        });
    });

    it("should find a person correctly", () => {
        let testQuery = `{
             getPerson(id: 3){
                name
                id
            }
        }`;

        return graphql(Schema, testQuery, undefined, {persons}).then((res) => {
            assertNoError(res);
            expect(res.data).toMatchSnapshot();
        });
    });

    it("should find a person and drill down matches (2 levels) correctly", () => {
        let testQuery = `{
             getPerson(id: 3){
                name
                id
                matches {
                    id
                    matches {
                        name
                    }
                }
            }
        }`;

        return graphql(Schema, testQuery, undefined, {persons}).then((res) => {
            assertNoError(res);
            expect(res.data).toMatchSnapshot();
        });
    });
});
