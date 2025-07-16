contract FreelancePlatform {
    // Dados dos usuários
    struct User {
        address userAddress;
        string name;
        bool isFreelancer;
        bool exists;
    }

    // Job aberto para propostas
    struct Job {
        uint id;
        address payable employer;
        string description;
        uint budget; // em wei
        bool isOpen;
        uint acceptedProposalId; // id da proposta aceita, 0 = nenhuma
    }

    // Proposta de freelancer
    struct Proposal {
        uint id;
        uint jobId;
        address payable freelancer;
        string proposalText;
        bool accepted;
        bool paid;
    }

    uint public jobCount;
    uint public proposalCount;
    uint[] public jobIds;

    mapping(address => User) public users;
    mapping(uint => Job) public jobs;
    mapping(uint => Proposal) public proposals;
    mapping(uint => uint[]) public proposalsByJob;
    mapping(address => mapping(uint => bool)) public hasProposed;



    // Eventos
    event UserRegistered(address user, string name, bool isFreelancer);
    event JobCreated(uint jobId, address employer, uint budget);
    event ProposalSubmitted(uint proposalId, uint jobId, address freelancer);
    event ProposalAccepted(uint proposalId);
    event PaymentReleased(uint proposalId, address freelancer, uint amount);

    // Cadastro de usuários
    function registerUser(string memory name, bool isFreelancer) external {
        require(!users[msg.sender].exists, "Usuario ja registrado");
        users[msg.sender] = User(msg.sender, name, isFreelancer, true);
        emit UserRegistered(msg.sender, name, isFreelancer);
    }

    // Criar job (somente para empregador)
    function createJob(string memory description) external payable {
        require(users[msg.sender].exists && !users[msg.sender].isFreelancer, "Somente empregadores");
        require(msg.value > 0, "Deve enviar pagamento como deposito");

        jobCount++;
        jobs[jobCount] = Job(jobCount, payable(msg.sender), description, msg.value, true, 0);

        jobIds.push(jobCount); // 

        emit JobCreated(jobCount, msg.sender, msg.value);
    }

    // Freelancer envia proposta para job aberto
    function submitProposal(uint jobId, string memory proposalText) external {
        require(users[msg.sender].exists && users[msg.sender].isFreelancer, "Somente freelancers");
        Job storage job = jobs[jobId];
        require(job.isOpen, "Job fechado");
        require(!hasProposed[msg.sender][jobId], "Ja enviou proposta para esse job");

        proposalCount++;
        proposals[proposalCount] = Proposal(proposalCount, jobId, payable(msg.sender), proposalText, false, false);
        proposalsByJob[jobId].push(proposalCount);
        hasProposed[msg.sender][jobId] = true;

        emit ProposalSubmitted(proposalCount, jobId, msg.sender);
    }

    // Empregador aceita proposta
    function acceptProposal(uint proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        Job storage job = jobs[proposal.jobId];

        require(msg.sender == job.employer, "Somente empregador pode aceitar");
        require(job.isOpen, "Job fechado");
        require(!proposal.accepted, "Proposta ja aceita");

        proposal.accepted = true;
        job.isOpen = false;
        job.acceptedProposalId = proposalId;

        emit ProposalAccepted(proposalId);
    }

    // Empregador libera pagamento para freelancer
    function releasePayment(uint proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        Job storage job = jobs[proposal.jobId];

        require(msg.sender == job.employer, "Somente empregador pode liberar pagamento");
        require(proposal.accepted, "Proposta nao aceita");
        require(!proposal.paid, "Pagamento ja liberado");

        proposal.paid = true;
        // proposal.freelancer.transfer(job.budget);
        (bool success, ) = proposal.freelancer.call{value: job.budget}("");
        require(success, "Falha na transferencia");

        emit PaymentReleased(proposalId, proposal.freelancer, job.budget);
    }

    function getAllJobs() external view returns (Job[] memory) {
        Job[] memory allJobs = new Job[](jobIds.length);
        for (uint i = 0; i < jobIds.length; i++) {
            allJobs[i] = jobs[jobIds[i]];
        }
        return allJobs;
    }

    function getProposalsByJob(uint jobId) external view returns (Proposal[] memory) {
        uint[] storage ids = proposalsByJob[jobId];
        Proposal[] memory jobProposals = new Proposal[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            jobProposals[i] = proposals[ids[i]];
        }
        return jobProposals;
    }

    function getAllJobIds() external view returns (uint[] memory) {
        return jobIds;
    }
    
    function getUser(address userAddr) public view returns (string memory name, bool isFreelancer, bool exists) {
        User storage user = users[userAddr];
        return (user.name, user.isFreelancer, user.exists);
    }

}
