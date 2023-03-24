"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (
      resolve,
      reject
    ) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step(
        (generator = generator.apply(
          thisArg,
          _arguments || []
        )).next()
      );
    });
  };
Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.accessUser = void 0;
const not_found_1 = require("../../../error/not-found");
const user_1 = require("../../../model/user");
function accessUser(req, res, next) {
  return __awaiter(this, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const user = yield user_1.User.findByIdAndUpdate(
        id,
        {
          $set: {
            hasAccess: status,
          },
        },
        { new: true }
      )
        .select("-logs -classes")
        .populate([
          {
            path: "role",
            select: "name description permissions",
            populate: [
              {
                path: "permissions",
                select: "name description",
              },
            ],
          },
        ]);
      if (!user) {
        throw new not_found_1.NotFoundErr(
          "Không Tìm Thấy Người Dùng"
        );
      }
      res.json({
        user,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
}
exports.accessUser = accessUser;
