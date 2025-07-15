// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FreelancePlatform} from "../src/FreelancePlatform.sol";
import "forge-std/Script.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        new FreelancePlatform();
        vm.stopBroadcast();
    }
}
