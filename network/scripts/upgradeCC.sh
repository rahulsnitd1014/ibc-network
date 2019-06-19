#!/bin/bash
#
# This script is designed to upgrade the Chaincode with specified version
# Process includes to initially install the modified chaincode
# and further upgrading it

echo
echo "========= Upgrading chaincode for your network ========= "
echo
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
TIMEOUT="$4"
VERBOSE="$5"
: ${DELAY:="3"}
: ${LANGUAGE:="golang"}
: ${TIMEOUT:="10"}
: ${VERBOSE:="false"}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
COUNTER=1
MAX_RETRY=5
UPGRADE_CC_VERSION="$6"

CC_SRC_PATH="github.com/chaincode/"
if [ "$LANGUAGE" = "node" ]; then
	CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/"
fi
echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo 
echo
# import utils
. scripts/utils.sh

echo "===================== Installing upgraded chaincode -v ${UPGRADE_CC_VERSION} on peer0.org1  ===================== "
installChaincode 0 1 ${UPGRADE_CC_VERSION}
echo "===================== Installing upgraded chaincode -v ${UPGRADE_CC_VERSION} on peer0.org2 ===================== "
installChaincode 0 2 ${UPGRADE_CC_VERSION}

echo "===================== Upgrading chaincode -v ${UPGRADE_CC_VERSION} on peer0.org1 ===================== "
upgradeChaincode 0 1 ${UPGRADE_CC_VERSION} ${CHANNEL_NAME}

echo
echo
echo "========= All GOOD, chaincode is upgraded =========== "
echo
echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0
