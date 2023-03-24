"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc
            ? !m.__esModule
            : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", {
          enumerable: true,
          value: v,
        });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (
          k !== "default" &&
          Object.prototype.hasOwnProperty.call(mod, k)
        )
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.uploader = void 0;
const multer_1 = __importStar(require("multer"));
const uploader = (0, multer_1.default)({
  storage: (0, multer_1.diskStorage)({
    destination(_req, _file, callback) {
      callback(null, "../uploads");
    },
    filename(_req, file, callback) {
      file.originalname = Buffer.from(
        file.originalname,
        "latin1"
      ).toString("utf8");
      callback(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 500 * 1024 * 1024, // Limit: 500M
  },
});
exports.uploader = uploader;
