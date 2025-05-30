import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { fetchData, postData, updateData, deleteData } from "../../utils/axios";

const mock = new MockAdapter(axios);

describe("axios utils", () => {
  afterEach(() => {
    mock.reset();
  });

  it("should successfully fetch data with GET request", async () => {
    const mockResponse = { message: "Data fetched successfully" };

    mock.onGet("/data").reply(200, mockResponse);

    const result = await fetchData("/data");

    expect(result).toEqual(mockResponse);
  });

  it("should handle error if fetching data fails", async () => {
    mock.onGet("/data").reply(500, { message: "Failed to fetch data" });

    try {
      await fetchData("/data");
    } catch (error) {
      const typedError = error as Error;
      expect(typedError.message).toBe("Failed to fetch data");
    }
  });

  it("should successfully post data with POST request", async () => {
    const postDataPayload = { title: "New Post" };
    const mockResponse = { message: "Data posted successfully", id: 1 };

    mock.onPost("/data").reply(200, mockResponse);

    const result = await postData("/data", postDataPayload);

    expect(result).toEqual(mockResponse);
  });

  it("should handle error if posting data fails", async () => {
    const postDataPayload = { title: "New Post" };

    mock.onPost("/data").reply(500, { message: "Failed to post data" });

    try {
      await postData("/data", postDataPayload);
    } catch (error) {
      const typedError = error as Error;
      expect(typedError.message).toBe("Failed to post data");
    }
  });

  it("should successfully update data with PUT request", async () => {
    const updateDataPayload = { title: "Updated Post" };
    const mockResponse = { message: "Data updated successfully" };

    mock.onPut("/data/1").reply(200, mockResponse);

    const result = await updateData("/data/1", updateDataPayload);

    expect(result).toEqual(mockResponse);
  });

  it("should handle error if updating data fails", async () => {
    const updateDataPayload = { title: "Updated Post" };

    mock.onPut("/data/1").reply(500, { message: "Failed to update data" });

    try {
      await updateData("/data/1", updateDataPayload);
    } catch (error) {
      const typedError = error as Error;
      expect(typedError.message).toBe("Failed to update data");
    }
  });

  it("should successfully delete data with DELETE request", async () => {
    const mockResponse = { message: "Data deleted successfully" };

    mock.onDelete("/data/1").reply(200, mockResponse);

    const result = await deleteData("/data/1");

    expect(result).toEqual(mockResponse);
  });

  it("should handle error if deleting data fails", async () => {
    mock.onDelete("/data/1").reply(500, { message: "Failed to delete data" });

    try {
      await deleteData("/data/1");
    } catch (error) {
      const typedError = error as Error;
      expect(typedError.message).toBe("Failed to delete data");
    }
  });
});
