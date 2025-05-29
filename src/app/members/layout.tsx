import React, { ReactNode } from 'react';

const MembersLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <header>
        <h1>Members Section</h1>
        <nav>
          <a href="/members">All Members</a> | <a href="/members/borrow">Borrow Book</a>
        </nav>
      </header>
      <main>{children}</main> 
      <footer>
        <p>Members Footer Content</p>
      </footer>
    </div>
  );
};

export default MembersLayout;
