export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url: string;
}

export interface Museum {
  id: string;
  name: string; // Add other necessary fields as needed
  profilePhotoUrl: string;
}

export interface Exhibition {
  id: string;
  museum_id: string;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
  cover_photo_url: string;
  ticket_link: string;
  museum: Museum;
}

export interface ExhibitionAndMuseum {
  id: string;
  title: string;
  cover_photo_url: string;
  museum: {
    id: string;
    username: string;
    profilePhotoUrl: string;
  };
}

export interface ExhibitionBasic {
  title: string;
  cover_photo_url: string;
  museum: {
    name: string;
  };
}

export interface FollowedUser {
  following_id: string;
}

export interface FollowedUsers extends Array<FollowedUser>{};

export interface Artifact {
  id: string;
  exhibition: {
    id: string,
    cover_photo_url: string,
  };
  title: string;
  description: string;
  cover_photo_url: string;
}

export interface ArtifactBasic {
  id: string;
  exhibition_id: string;
  title: string;
  description: string;
  cover_photo_url: string;
}
