// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/FreelancePlatform.sol";



contract FreelancePlatformTest is Test {
    FreelancePlatform platform;

    address employer = address(0x1);
    address freelancer = address(0x2);

    function setUp() public {
        platform = new FreelancePlatform();
    }

    // ... outros testes

    function testSubmitProposal() public {
        // Setup employer e job
        vm.prank(employer);
        platform.registerUser("Empresa", false);
        vm.deal(employer, 10 ether);
        vm.prank(employer);
        platform.createJob{value: 1 ether}("Desenvolver site");

        // Registrar freelancer
        vm.prank(freelancer);
        platform.registerUser("Freelancer", true);

        // Freelancer envia proposta
        vm.prank(freelancer);
        platform.submitProposal(1, "Posso fazer em 2 semanas");

        // Desestruturação do retorno do mapping
        (
            uint proposalId,
            uint jobId,
            address payable freelancerAddr,
            string memory proposalText,
            bool accepted,
            bool paid
        ) = platform.proposals(1);

        assertEq(proposalId, 1);
        assertEq(jobId, 1);
        assertEq(proposalText, "Posso fazer em 2 semanas");
        assertFalse(accepted);
        assertFalse(paid);
        assertEq(freelancerAddr, freelancer);
    }

    function testAcceptProposal() public {
        testSubmitProposal();

        vm.prank(employer);
        platform.acceptProposal(1);

        (
            uint proposalId,
            uint jobId,
            address payable freelancerAddr,
            string memory proposalText,
            bool accepted,
            bool paid
        ) = platform.proposals(1);

        (
            uint jobId2,
            address payable jobEmployer,
            string memory description,
            uint budget,
            bool isOpen,
            uint acceptedProposalId
        ) = platform.jobs(1);

        assertTrue(accepted);
        assertFalse(isOpen);
        assertEq(acceptedProposalId, 1);
    }

    function testReleasePayment() public {
        testAcceptProposal();

        vm.deal(freelancer, 0);

        vm.prank(employer);
        platform.releasePayment(1);

        (
            uint proposalId,
            uint jobId,
            address payable freelancerAddr,
            string memory proposalText,
            bool accepted,
            bool paid
        ) = platform.proposals(1);

        assertTrue(paid);
        assertEq(freelancer.balance, 1 ether);
    }

    function testSubmitProposalFailsIfNotFreelancer() public {
        vm.prank(employer);
        vm.expectRevert("Somente freelancers");
        platform.submitProposal(1, "Nao sou freelancer");
    }

    function testCreateJobFailsIfNotEmployer() public {
        // Registrar freelancer
        vm.prank(freelancer);
        platform.registerUser("Freelancer", true);

        // Dar saldo para freelancer para que ele possa pagar 1 ether no createJob
        vm.deal(freelancer, 10 ether);

        // Configurar a chamada para vir do freelancer
        vm.prank(freelancer);

        // Esperar que a chamada reverta com a mensagem exata
        vm.expectRevert(bytes("Somente empregadores"));

        // Chamar createJob como freelancer (deve falhar)
        platform.createJob{value: 1 ether}("Job invalido");
    }

    function testJobIdsTracking() public {
        vm.prank(employer);
        platform.registerUser("Empresa", false);
        vm.deal(employer, 10 ether);

        // Criar 2 jobs
        vm.prank(employer);
        platform.createJob{value: 1 ether}("Job 1");

        vm.prank(employer);
        platform.createJob{value: 2 ether}("Job 2");

        // Verificar jobIds
        uint jobId1 = platform.jobIds(0);
        uint jobId2 = platform.jobIds(1);

        assertEq(jobId1, 1);
        assertEq(jobId2, 2);

        // Verificar comprimento
        uint[] memory allIds = platform.getAllJobIds();
        assertEq(allIds.length, 2);
        assertEq(allIds[0], 1);
        assertEq(allIds[1], 2);
    }
    function testCannotSubmitMultipleProposalsToSameJob() public {
        // Setup: empregador cria job
        vm.prank(employer);
        platform.registerUser("Empresa", false);
        vm.deal(employer, 1 ether);
        vm.prank(employer);
        platform.createJob{value: 1 ether}("Job");

        // Setup: freelancer se registra
        vm.prank(freelancer);
        platform.registerUser("Freelancer", true);

        // Primeira proposta
        vm.prank(freelancer);
        platform.submitProposal(1, "Proposta 1");

        // Segunda proposta deve falhar
        vm.prank(freelancer);
        vm.expectRevert("Ja enviou proposta para esse job");
        platform.submitProposal(1, "Proposta 2");
    }

    function testProposalsByFreelancer() public {
        vm.prank(employer);
        platform.registerUser("Empresa", false);
        vm.deal(employer, 1 ether);
        vm.prank(employer);
        platform.createJob{value: 1 ether}("Novo job");

        vm.prank(freelancer);
        platform.registerUser("Freela", true);

        vm.prank(freelancer);
        platform.submitProposal(1, "Posso entregar em 5 dias");

        // usa a função correta
        FreelancePlatform.Proposal[] memory props = platform.getProposalsByFreelancer(freelancer);
        assertEq(props.length, 1);
        assertEq(props[0].id, 1);
    }


    function testGetProposalsByFreelancer() public {
        vm.prank(employer);
        platform.registerUser("Empresa", false);
        vm.deal(employer, 1 ether);
        vm.prank(employer);
        platform.createJob{value: 1 ether}("Novo job");

        vm.prank(freelancer);
        platform.registerUser("Freela", true);

        vm.prank(freelancer);
        platform.submitProposal(1, "Posso entregar em 5 dias");

        FreelancePlatform.Proposal[] memory propostas = platform.getProposalsByFreelancer(freelancer);
        assertEq(propostas.length, 1);
        assertEq(propostas[0].freelancer, freelancer);
        assertEq(propostas[0].proposalText, "Posso entregar em 5 dias");
    }

}
