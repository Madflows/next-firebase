function UserProfile({ user }) {
  return (
    <div className="box-center">
      <img src={user.photoURL} className="card-img-center" />
      <p className="username-verified">
        <i>@{user.username}</i>
        <span>
          {user.verified ? (
            <box-icon type="solid" name="badge-check" color="#00acee" size="sm" />
          ) : null}
        </span>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
}

export default UserProfile;
