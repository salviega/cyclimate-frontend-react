// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "./BenefitContract.sol";

contract BenefitsContract {

    mapping(string => address) public benefitContracts;

    function createBenefit(string memory _benefitId, address _addressBenefitContract) public {
        benefitContracts[_benefitId] = _addressBenefitContract;
    }

    function getBenefit(string memory _benefitId) public view returns(address){
        return benefitContracts[_benefitId];
    }
} 
