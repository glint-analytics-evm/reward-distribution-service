# Root directory of app
ROOT_DIR=$(git rev-parse --show-toplevel)

# Path to Protoc Plugin
PROTOC_GEN_TS_PATH="${ROOT_DIR}/node_modules/.bin/protoc-gen-ts_proto"

# Directory holding all .proto files
SRC_DIR="${ROOT_DIR}/src/proto"

# Directory to write generated code (.d.ts files)
OUT_DIR="${ROOT_DIR}/src/proto/generated"

# Clean all existing generated files
rm -r "${OUT_DIR}"
mkdir "${OUT_DIR}"

echo "Generating TS files ..."
protoc \
--plugin="${PROTOC_GEN_TS_PATH}" \
--ts_proto_out="${OUT_DIR}" \
--ts_proto_opt=outputEncodeMethods=false,outputJsonMethods=false,outputClientImpl=false, \
--proto_path="${SRC_DIR}" \
--experimental_allow_proto3_optional \
$(find "${SRC_DIR}" -iname "*.proto")