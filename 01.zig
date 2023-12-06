const std = @import("std");

pub fn main() !void {
    var q = @embedFile("data/01.in");
    var it = std.mem.splitAny(u8, q, "\n");
    var s: i32 = 0;
    while (it.next()) |line| {
        if (line.len == 0) {
            break;
        }
        var first_digit: u8 = 255;
        for (line) |c| {
            if (c >= '0' and c <= '9') {
                first_digit = c - '0';
                break;
            }
        }
        var last_digit: u8 = 255;
        var i = line.len;
        while (i > 0) {
            i -= 1;
            var c = line.ptr[i];
            if (c >= '0' and c <= '9') {
                last_digit = c - '0';
                break;
            }
        }
        s += @as(i32, first_digit) * 10 + @as(i32, last_digit);
        // std.debug.print("{s} {} {}\n", .{ line, first_digit, last_digit });
    }
    std.debug.print("Part 1: {d}\n", .{s});
}
