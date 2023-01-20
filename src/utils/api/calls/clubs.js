const { API_URL } = require("../index");

export const getClub = async (clubId) => {
  let url = `${API_URL}/clubs/getClub?clubId=${clubId}`;

  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const clubCreate = async (club) => {
  const { name, description, sponsorId, room } = club;

  let url = `${API_URL}/clubs/create`;

  let data = {
    name,
    description,
    sponsorId,
    room,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubApprove = async (adminId, clubId, decision) => {
  let url = `${API_URL}/clubs/approve`;

  let data = {
    adminId,
    clubId,
    decision,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubDelete = async (clubId, userId) => {
  let url = `${API_URL}/clubs/delete`;

  let data = {
    clubId,
    userId,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubEdit = async (userId, clubId, club) => {
  const { name, description, importantDates, room } = club;

  let url = `${API_URL}/clubs/edit`;

  let data = {
    userId,
    clubId,
    name,
    description,
    importantDates,
    room,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubUpdateDues = async (clubId, userId, updateId, paidStatus) => {
  let url = `${API_URL}/clubs/updateDues`;

  let data = {
    clubId,
    userId,
    updateId,
    paidStatus,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubJoin = async (clubId, userId) => {
  let url = `${API_URL}/clubs/join`;

  let data = {
    clubId,
    userId,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubMemberApproveDeny = async (
  clubId,
  userId,
  requestUserId,
  decision
) => {
  let url = `${API_URL}/clubs/members/approveDeny`;

  let data = {
    clubId,
    userId,
    requestUserId,
    decision,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubLeave = async (clubId, userId) => {
  let url = `${API_URL}/clubs/leave`;

  let data = {
    clubId,
    userId,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubMemberRemove = async (clubId, userId, removeUserId) => {
  let url = `${API_URL}/clubs/members/remove`;

  let data = {
    clubId,
    userId,
    removeUserId,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubMemberPromoteDemote = async (
  clubId,
  userId,
  promoteDemoteUserId
) => {
  let url = `${API_URL}/clubs/members/promoteDemote`;

  let data = {
    clubId,
    userId,
    promoteDemoteUserId,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubMeetingNew = async (clubId, userId, date) => {
  let url = `${API_URL}/clubs/meetings/new`;

  let data = {
    clubId,
    userId,
    date,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubMeetingEdit = async (userId, meetingId, studentId, status) => {
  let url = `${API_URL}/clubs/meetings/edit`;

  let data = {
    userId,
    meetingId,
    studentId,
    status,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubMeetingDelete = async (clubId, userId, meetingId) => {
  let url = `${API_URL}/clubs/meetings/delete`;

  let data = {
    clubId,
    userId,
    meetingId,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubAnnouncementNew = async (clubId, userId, announcement) => {
  const { message, tags, dateReminder, image } = announcement;

  let url = `${API_URL}/clubs/announcements/new`;

  let data = {
    clubId,
    userId,
    message,
    tags,
    date: dateReminder,
    image,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubAnnouncementEdit = async (
  announcementId,
  userId,
  announcement
) => {
  const { message, tags, dateReminder, image } = announcement;

  let url = `${API_URL}/clubs/announcements/edit`;

  let data = {
    announcementId,
    userId,
    message,
    tags,
    date: dateReminder,
    image,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubAnnouncementDelete = async (userId, announcementId) => {
  let url = `${API_URL}/clubs/announcements/delete`;

  let data = {
    userId,
    announcementId,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubTagNew = async (clubId, userId, name, color) => {
  let url = `${API_URL}/clubs/tags/new`;

  let data = {
    clubId,
    userId,
    name,
    color,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubTagEdit = async (userId, tagId, name, color) => {
  let url = `${API_URL}/clubs/tags/edit`;

  let data = {
    userId,
    tagId,
    name,
    color,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const clubTagDelete = async (userId, tagId) => {
  let url = `${API_URL}/clubs/tags/delete`;

  let data = {
    userId,
    tagId,
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};
