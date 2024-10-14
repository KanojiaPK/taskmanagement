import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AdminMain = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8003/api/v1/teams/get-Teams"
        );
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  // Fetch available users for adding team members
  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8003/api/v1/user/get-users"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setAvailableUsers(response.data.data);
          setFilteredUsers(response.data.data);
        } else {
          console.error(
            "Available users response is not an array:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching available users:", error);
      }
    };
    fetchAvailableUsers();
  }, []);

  const handleCreateTeam = async () => {
    if (newTeam) {
      const team = { name: newTeam, members: [] };
      try {
        const response = await axios.post(
          "http://localhost:8003/api/v1/teams/add-Team",
          team
        );
        setTeams([...teams, response.data]);
        setNewTeam("");
      } catch (error) {
        console.error("Error creating team:", error);
      }
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      await axios.put(`http://localhost:8003/api/v1/teams/delete-Team/${id}`);
      setTeams(teams.filter((team) => team._id !== id));
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setMembers(team.members);
  };

  const handleAddMember = async () => {
    if (selectedUser && selectedTeam) {
      const memberId = selectedUser._id;

      const isMemberAlreadyAdded = members.some((m) => m._id === memberId);
      if (isMemberAlreadyAdded) {
        alert(
          `${selectedUser.firstname} ${selectedUser.lastname} is already a member of this team.`
        );
        return;
      }

      try {
        const updatedMembers = [...members.map((m) => m._id), memberId];

        await axios.put(
          `http://localhost:8003/api/v1/teams/edit-Team/${selectedTeam._id}`,
          { members: updatedMembers }
        );

        // Add the new member to the local state
        setMembers([
          ...members,
          {
            _id: memberId,
            firstname: selectedUser.firstname,
            lastname: selectedUser.lastname,
          },
        ]);

        // Remove the added user from the available users list
        const updatedAvailableUsers = availableUsers.filter(
          (user) => user._id !== memberId
        );
        setAvailableUsers(updatedAvailableUsers);

        setSelectedUser(null);
        setSearchTerm("");
      } catch (error) {
        console.error("Error adding member:", error);
      }
    }
  };

  const handleRemoveMember = async (member) => {
    if (selectedTeam) {
      try {
        const updatedMembers = members
          .filter((m) => m._id !== member._id)
          .map((m) => m._id);

        await axios.put(
          `http://localhost:8003/api/v1/teams/edit-Team/${selectedTeam._id}`,
          { members: updatedMembers }
        );

        setMembers(
          updatedMembers.map((id) => {
            const user = members.find((m) => m._id === id);
            return {
              _id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
            };
          })
        );

        setAvailableUsers((prevUsers) => [
          ...prevUsers,
          {
            _id: member._id,
            firstname: member.firstname,
            lastname: member.lastname,
          },
        ]);
      } catch (error) {
        console.error("Error removing member:", error);
      }
    }
  };

  const handleCloseMembersView = () => {
    setSelectedTeam(null);
    setMembers([]);
  };

  // Filter users based on the search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(availableUsers);
    } else {
      setFilteredUsers(
        availableUsers.filter((user) =>
          `${user.firstname} ${user.lastname}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, availableUsers]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm(`${user.firstname} ${user.lastname}`);
    setShowDropdown(false);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user"); // Adjust this according to your user storage
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center">Admin Dashboard</h1>

      <button
        onClick={handleLogout}
        className="absolute px-4 py-2 mb-4 text-white bg-red-500 rounded right-5 "
      >
        Logout
      </button>

      <div className="mb-6">
        <input
          type="text"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          placeholder="New Team Name"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleCreateTeam}
          className="px-4 py-2 ml-2 text-white bg-blue-500 rounded"
        >
          Create Team
        </button>
      </div>

      <h2 className="mb-4 text-2xl font-bold">Teams</h2>
      <div className="p-4 bg-white rounded shadow-md">
        {teams.map((team) => (
          <div
            key={team._id}
            className="flex items-center justify-between p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-200"
            onClick={() => handleSelectTeam(team)}
          >
            <span>{team.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTeam(team._id);
              }}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {selectedTeam && (
        <div className="relative p-4 mt-6 bg-white rounded shadow-md">
          <h3 className="mb-2 text-xl font-bold">
            {selectedTeam.name} Members
          </h3>
          <button
            onClick={handleCloseMembersView}
            className="absolute text-gray-500 top-2 right-5 hover:text-gray-800"
          >
            X
          </button>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Members..."
              value={searchTerm}
              onFocus={handleFocus}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
            {showDropdown && (
              <ul className="absolute z-10 mt-1 overflow-y-auto bg-white border border-gray-300 rounded shadow-md max-h-40">
                {filteredUsers.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {user.firstname} {user.lastname}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <button
              onClick={handleAddMember}
              className="px-4 py-2 text-white bg-green-500 rounded"
            >
              Add Member
            </button>
          </div>
          <ul>
            {members.map((member) => (
              <li
                key={member._id}
                className="flex items-center justify-between p-2 border-b border-gray-300"
              >
                {member.firstname} {member.lastname}
                <button
                  onClick={() => handleRemoveMember(member)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminMain;
