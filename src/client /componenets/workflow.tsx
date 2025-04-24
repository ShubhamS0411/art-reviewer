export default function Workflow() {
    return (
      <div className="px-4 py-10">
        <h2 className="text-3xl font-bold text-left ml-6 mb-10">📑 Workflow</h2>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
          {/* Card 1: Sign Up */}
          <div className="flex-1 max-w-sm bg-white rounded-xl shadow-2xl p-5">
            <h3 className="text-xl font-semibold text-center mb-4">Sign Up</h3>
            <img
              src="https://res.cloudinary.com/dw1wsmtml/image/upload/v1745328570/Screenshot_2025-04-22_at_5.04.31_PM_ueqcqs.png"
              alt="signup"
              className="w-full h-auto object-contain rounded-lg mb-4"
            />
            <p className="text-sm text-gray-700">
              Sign up as a <b>Creator</b> to post your artforms and receive reviews, or as a <b>Reviewer</b> to share feedback — or both!
            </p>
          </div>
  
          {/* Card 2: Post Artform */}
          <div className="flex-1 max-w-sm bg-white rounded-xl shadow-2xl p-5">
            <h3 className="text-xl font-semibold text-center mb-4">
              Post Artform{" "}
              <span className="text-xs bg-gray-200 px-2 py-1 rounded ml-2">For Creators</span>
            </h3>
            <img
              src="https://res.cloudinary.com/dw1wsmtml/image/upload/v1745328662/Screenshot_2025-04-22_at_5.09.33_PM_wfspyo.png"
              alt="post"
              className="w-full h-auto object-contain rounded-lg mb-4"
            />
            <p className="text-sm text-gray-700">
              Creators can upload artforms with descriptions and categories. Posts appears on dashboard and PDP.
              <br />
              <b>Note:</b> Verified creators have a special visual effect on their posts.
            </p>
          </div>
  
          {/* Card 3: Give Reviews */}
          <div className="flex-1 max-w-sm bg-white rounded-xl shadow-2xl p-5">
            <h3 className="text-xl font-semibold text-center mb-4">
              Give Reviews{" "}
              <span className="text-xs bg-gray-200 px-2 py-1 rounded ml-2">For Reviewers</span>
            </h3>
            <img
              src="https://res.cloudinary.com/dw1wsmtml/image/upload/v1745328754/Screenshot_2025-04-22_at_5.25.06_PM_r789j2.png"
              alt="review"
              className="w-56 h-80 object-fill rounded-lg mb-4 mx-auto"
            />
            <p className="text-sm text-gray-700">
              Reviewers can leave feedback on artforms and track them in both dashboard or PDP.
              <br />
              <b>Note:</b> Verified reviewers get a visual highlight on their feedback.
            </p>
          </div>
        </div>
      </div>
    );
  }
  