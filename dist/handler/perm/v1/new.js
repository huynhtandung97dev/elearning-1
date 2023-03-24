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
exports.newPerm = void 0;
const gperm_1 = require("../../../model/gperm");
const perm_1 = require("../../../model/perm");
function newPerm(req, res, next) {
  return __awaiter(this, void 0, void 0, function* () {
    const { name, groupId, description } = req.body;
    try {
      // Create permissions
      const perm = perm_1.Perm.build({
        name,
        groupId,
        description,
      });
      yield perm.save();
      // Add permission to group
      yield gperm_1.GPerm.findByIdAndUpdate(groupId, {
        $addToSet: {
          permissions: perm.id,
        },
      });
      res.status(201).json({
        permission: perm,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
}
exports.newPerm = newPerm;
