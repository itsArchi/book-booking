import { NextRequest, NextResponse } from "next/server";
import handler from "../../../app/api/member/borrow/route";
import { createServer } from "http";
import request from "supertest";

describe("POST /api/member/borrow", () => {
  const server = createServer((req, res) => {
    const nextRequest = new NextRequest(req);
    const nextResponse = new NextResponse(res);
    return handler(nextRequest, nextResponse);
  });

  it("should successfully borrow a book", async () => {
    const response = await request(server)
      .put("/api/member/borrow")
      .send({ memberCode: "M001", bookCode: "JK-45" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Book borrowed successfully");
  });

  it("should return an error if book is already borrowed", async () => {
    const response = await request(server)
      .put("/api/member/borrow")
      .send({ memberCode: "M002", bookCode: "HOB-83" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Book is already borrowed");
  });

  it("should return an error if member has already borrowed 2 books", async () => {
    const response = await request(server)
      .put("/api/member/borrow")
      .send({ memberCode: "M003", bookCode: "SHR-1" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Member has already borrowed 2 books");
  });
});
