export interface Profile {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Board {
  id: string
  user_id: string
  title: string
  created_at: string
}

export interface Pin {
  id: string
  user_id: string
  board_id: string
  image_url: string
  title: string | null
  link_url: string | null
  note: string | null
  created_at: string
  boards?: Pick<Board, 'id' | 'title'>
}
