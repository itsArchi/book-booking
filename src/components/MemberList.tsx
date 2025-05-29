import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { Member as PrismaMember, Book } from '@prisma/client';

type Member = PrismaMember & {
    books: Book[];
  };
const MemberList = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async (): Promise<void> => {
        try {
          const response = await axios.get('/member', {
            params: {
              include: 'books',
            },
          });
          setMembers(response.data);
        } catch (error) {
          console.error('Error fetching members:', error);
        }
      };
    fetchMembers();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Member List</h2>
      <div className="grid grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member.code} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{member.name}</h3>
            <p>Code: {member.code}</p>
            <p>Borrowed Books: {member.books ? member.books.length : 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;
